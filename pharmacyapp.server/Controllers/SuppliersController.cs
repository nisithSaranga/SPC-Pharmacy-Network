using Microsoft.AspNetCore.Mvc;
using pharmacyapp.server.Data;
using pharmacyapp.server.Models;
using Microsoft.AspNetCore.Authorization;

namespace pharmacyapp.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly PharmacyContext _context;

        public SuppliersController(PharmacyContext context)
        {
            _context = context;
        }

        // GET: api/suppliers
        [HttpGet]
        public ActionResult<IEnumerable<Supplier>> GetSuppliers()
        {
            return _context.Suppliers.ToList();
        }

        // GET: api/suppliers/{id}
        [HttpGet("{id}")]
        public ActionResult<Supplier> GetSupplier(int id)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier == null)
                return NotFound();
            return supplier;
        }

        // POST: api/suppliers
        [HttpPost]
        public ActionResult<Supplier> RegisterSupplier([FromBody] Supplier supplier)
        {
            if (supplier == null)
                return BadRequest();

            _context.Suppliers.Add(supplier);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplier);
        }

        // PUT: api/suppliers/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateSupplier(int id, [FromBody] Supplier updatedSupplier)
        {
            if (updatedSupplier == null || id != updatedSupplier.Id)
                return BadRequest();

            var supplier = _context.Suppliers.Find(id);
            if (supplier == null)
                return NotFound();

            supplier.Name = updatedSupplier.Name;
            supplier.Address = updatedSupplier.Address;
            supplier.Email = updatedSupplier.Email;
            supplier.Phone = updatedSupplier.Phone;
            supplier.ContactPerson = updatedSupplier.ContactPerson;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/suppliers/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteSupplier(int id)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier == null)
                return NotFound();

            _context.Suppliers.Remove(supplier);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
