using Microsoft.AspNetCore.Mvc;
using pharmacyapp.server.Data;    // <-- Use lowercase if your project/folder is lowercase!
using pharmacyapp.server.Models;
using Microsoft.AspNetCore.Authorization;

namespace pharmacyapp.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PharmaciesController : ControllerBase
    {
        private readonly PharmacyContext _context;

        public PharmaciesController(PharmacyContext context)
        {
            _context = context;
        }

        // GET: api/pharmacies
        [HttpGet]
        public ActionResult<IEnumerable<Pharmacy>> GetPharmacies()
        {
            return _context.Pharmacies.ToList();
        }

        // GET: api/pharmacies/{id}
        [HttpGet("{id}")]
        public ActionResult<Pharmacy> GetPharmacy(int id)
        {
            var pharmacy = _context.Pharmacies.Find(id);
            if (pharmacy == null)
                return NotFound();
            return pharmacy;
        }

        // POST: api/pharmacies
        [HttpPost]
        public ActionResult<Pharmacy> AddPharmacy([FromBody] Pharmacy pharmacy)
        {
            if (pharmacy == null)
                return BadRequest();

            _context.Pharmacies.Add(pharmacy);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPharmacy), new { id = pharmacy.Id }, pharmacy);
        }

        // PUT: api/pharmacies/{id}
        [HttpPut("{id}")]
        public IActionResult UpdatePharmacy(int id, [FromBody] Pharmacy updatedPharmacy)
        {
            if (updatedPharmacy == null || id != updatedPharmacy.Id)
                return BadRequest();

            var pharmacy = _context.Pharmacies.Find(id);
            if (pharmacy == null)
                return NotFound();

            // Update all fields
            pharmacy.Name = updatedPharmacy.Name;
            pharmacy.Type = updatedPharmacy.Type;
            pharmacy.Address = updatedPharmacy.Address;
            pharmacy.Phone = updatedPharmacy.Phone;
            pharmacy.Email = updatedPharmacy.Email;
            pharmacy.Manager = updatedPharmacy.Manager;
            pharmacy.Status = updatedPharmacy.Status;
            pharmacy.MonthlyOrders = updatedPharmacy.MonthlyOrders;
            pharmacy.Revenue = updatedPharmacy.Revenue;
            pharmacy.IntegrationStatus = updatedPharmacy.IntegrationStatus;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/pharmacies/{id}
        [HttpDelete("{id}")]
        public IActionResult DeletePharmacy(int id)
        {
            var pharmacy = _context.Pharmacies.Find(id);
            if (pharmacy == null)
                return NotFound();

            _context.Pharmacies.Remove(pharmacy);
            _context.SaveChanges();
            return NoContent();
        }

        // PATCH: api/pharmacies/{id}/connect -- for integration status
        [HttpPatch("{id}/connect")]
        public IActionResult ConnectPharmacy(int id)
        {
            var pharmacy = _context.Pharmacies.Find(id);
            if (pharmacy == null)
                return NotFound();

            pharmacy.IntegrationStatus = "Connected";
            _context.SaveChanges();
            return NoContent();
        }
    }
}
