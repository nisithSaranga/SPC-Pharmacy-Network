using Microsoft.AspNetCore.Mvc;
using pharmacyapp.server.Data;
using pharmacyapp.server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace pharmacyapp.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly PharmacyContext _context;

        public OrdersController(PharmacyContext context)
        {
            _context = context;
        }
               [HttpGet]
        public IActionResult GetOrders()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var query = _context.Orders
                .Include(o => o.Pharmacy)
                .Include(o => o.Drug)
                .AsQueryable();

            if (role != "admin")
                query = query.Where(o => o.Username == username);

            var result = query.Select(o => new
            {
                o.Id,
                o.Quantity,
                o.OrderDate,
                o.Status,
                o.Username,
                o.PharmacyId,
                PharmacyName = o.Pharmacy != null ? o.Pharmacy.Name : null,
                o.DrugId,
                DrugName = o.Drug != null ? o.Drug.Name : null
            }).ToList();

            return Ok(result);
        }

               [HttpPost]
        public IActionResult PlaceOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest();
            if (!order.Quantity.HasValue || order.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero");

            var pharmacy = _context.Pharmacies.Find(order.PharmacyId);
            if (pharmacy == null)
                return BadRequest("Pharmacy not registered in the network");

            var drug = _context.Drugs.FirstOrDefault(d => d.Id == order.DrugId && d.IsActive);
            if (drug == null)
                return BadRequest("Drug not found");

            var currentStock = _context.StockMovements
                .Where(m => m.DrugId == order.DrugId)
                .Sum(m => (int?)m.Quantity) ?? 0;

            if (currentStock < order.Quantity.Value)
                return BadRequest($"Insufficient stock (available: {currentStock})");

            order.OrderDate = DateTime.Now;
            order.Username = User.FindFirstValue(ClaimTypes.Name);
            order.Status = "Pending";
            order.Pharmacy = null;
            order.Drug = null;

            _context.Orders.Add(order);
            _context.SaveChanges();

            _context.StockMovements.Add(new StockMovement
            {
                DrugId = order.DrugId,
                Quantity = -order.Quantity.Value,
                Reason = "OrderPlaced",
                Timestamp = DateTime.Now,
                Username = order.Username,
                OrderId = order.Id
            });
            _context.SaveChanges();

            return Ok(new { order.Id, order.Status });
        }

        [HttpPatch("{id}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] StatusUpdate update)
        {
            if (User.FindFirstValue(ClaimTypes.Role) != "admin")
                return Forbid();

            var order = _context.Orders.Find(id);
            if (order == null)
                return NotFound();

            if (update?.Status != "Approved" && update?.Status != "Rejected")
                return BadRequest("Status must be Approved or Rejected");

                       if (update.Status == "Rejected" && order.Status == "Pending" && order.Quantity.HasValue)
            {
                _context.StockMovements.Add(new StockMovement
                {
                    DrugId = order.DrugId,
                    Quantity = order.Quantity.Value,
                    Reason = "OrderRejected",
                    Timestamp = DateTime.Now,
                    Username = User.FindFirstValue(ClaimTypes.Name),
                    OrderId = order.Id
                });
            }

            order.Status = update.Status;
            _context.SaveChanges();

            return Ok(new { order.Id, order.Status });
        }
       
    }
        public class StatusUpdate
    {
        public string? Status { get; set; }
    }
}