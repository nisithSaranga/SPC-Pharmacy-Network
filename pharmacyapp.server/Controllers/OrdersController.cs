using Microsoft.AspNetCore.Mvc;
using pharmacyapp.server.Data;
using pharmacyapp.server.Models;
using Microsoft.AspNetCore.Authorization;


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
        public ActionResult<IEnumerable<Order>> GetOrders()
        {
            return _context.Orders.ToList();
        }

        [HttpPost]
        public IActionResult PlaceOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest();
            order.OrderDate = DateTime.Now;

            // Reduce Drug Quantity (simple logic)
            var drug = _context.Drugs.FirstOrDefault(d => d.Id == order.DrugId);
            if (drug == null || drug.Quantity < order.Quantity)
                return BadRequest("Insufficient stock or drug not found!");

            drug.Quantity -= order.Quantity;
            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok(order);
        }
    }
}

