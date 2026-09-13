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
    public class DrugsController : ControllerBase
    {
        private readonly PharmacyContext _context;

        public DrugsController(PharmacyContext context)
        {
            _context = context;
        }

        // GET: api/drugs
        [HttpGet]
        public IActionResult GetDrugs([FromQuery] bool includeInactive = false)
        {
            var query = _context.Drugs.AsQueryable();

            if (!includeInactive)
                query = query.Where(d => d.IsActive);

            var result = query
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Price,
                    d.IsActive,
                    Quantity = _context.StockMovements
                        .Where(m => m.DrugId == d.Id)
                        .Sum(m => (int?)m.Quantity) ?? 0
                })
                .ToList();

            return Ok(result);
        }

        // GET: api/drugs/{id}
        [HttpGet("{id}")]
        public IActionResult GetDrug(int id)
        {
            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();

            var quantity = _context.StockMovements
                .Where(m => m.DrugId == id)
                .Sum(m => (int?)m.Quantity) ?? 0;

            return Ok(new { drug.Id, drug.Name, drug.Price, drug.IsActive, Quantity = quantity });
        }

        // GET: api/drugs/{id}/movements
        [HttpGet("{id}/movements")]
        public IActionResult GetMovements(int id)
        {
            if (!_context.Drugs.Any(d => d.Id == id))
                return NotFound();

            var movements = _context.StockMovements
                .Where(m => m.DrugId == id)
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new { m.Id, m.Quantity, m.Reason, m.Timestamp, m.Username, m.OrderId })
                .ToList();

            return Ok(movements);
        }

        // POST: api/drugs  (register a new product)
        [HttpPost]
        public IActionResult AddDrug([FromBody] DrugRegistration request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Drug name is required");

            var name = request.Name.Trim();

            if (_context.Drugs.Any(d => d.Name == name))
                return Conflict("A drug with that name is already registered. Use Receive Stock to add quantity.");

            var drug = new Drug
            {
                Name = name,
                Price = request.Price,
                IsActive = true
            };

            _context.Drugs.Add(drug);
            _context.SaveChanges();

            if (request.OpeningStock > 0)
            {
                _context.StockMovements.Add(new StockMovement
                {
                    DrugId = drug.Id,
                    Quantity = request.OpeningStock,
                    Reason = "OpeningBalance",
                    Timestamp = DateTime.Now,
                    Username = User.FindFirstValue(ClaimTypes.Name)
                });
                _context.SaveChanges();
            }

            return CreatedAtAction(nameof(GetDrug), new { id = drug.Id },
                new { drug.Id, drug.Name, drug.Price, Quantity = request.OpeningStock });
        }

        // POST: api/drugs/{id}/receive
        [HttpPost("{id}/receive")]
        public IActionResult ReceiveStock(int id, [FromBody] StockAdjustment request)
        {
            if (request == null || request.Quantity == 0)
                return BadRequest("Quantity must not be zero");

            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();

            var currentStock = _context.StockMovements
                .Where(m => m.DrugId == id)
                .Sum(m => (int?)m.Quantity) ?? 0;

            if (currentStock + request.Quantity < 0)
                return BadRequest($"Adjustment would take stock below zero (current: {currentStock})");

            _context.StockMovements.Add(new StockMovement
            {
                DrugId = id,
                Quantity = request.Quantity,
                Reason = request.Quantity > 0 ? "Receipt" : "Adjustment",
                Timestamp = DateTime.Now,
                Username = User.FindFirstValue(ClaimTypes.Name)
            });
            _context.SaveChanges();

            return Ok(new { drug.Id, drug.Name, Quantity = currentStock + request.Quantity });
        }

        // PUT: api/drugs/{id}  (name and price only)
        [HttpPut("{id}")]
        public IActionResult UpdateDrug(int id, [FromBody] DrugRegistration request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Drug name is required");

            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();

            var name = request.Name.Trim();

            if (_context.Drugs.Any(d => d.Name == name && d.Id != id))
                return Conflict("Another drug with that name already exists");

            drug.Name = name;
            drug.Price = request.Price;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/drugs/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteDrug(int id)
        {
            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();

            if (_context.Orders.Any(o => o.DrugId == id))
            {
                drug.IsActive = false;
                _context.SaveChanges();
                return Ok(new { message = "Drug has order history and was retired instead of deleted.", retired = true });
            }

            var movements = _context.StockMovements.Where(m => m.DrugId == id);
            _context.StockMovements.RemoveRange(movements);
            _context.Drugs.Remove(drug);
            _context.SaveChanges();

            return Ok(new { message = "Drug deleted.", retired = false });
        }
    }

    public class DrugRegistration
    {
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public int OpeningStock { get; set; }
    }

    public class StockAdjustment
    {
        public int Quantity { get; set; }
    }
}