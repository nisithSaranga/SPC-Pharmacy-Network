using Microsoft.AspNetCore.Mvc;
using pharmacyapp.server.Data;
using pharmacyapp.server.Models;
using Microsoft.AspNetCore.Authorization;


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
        public ActionResult<IEnumerable<Drug>> GetDrugs()
        {
            return _context.Drugs.ToList();
        }

        // GET: api/drugs/{id}
        [HttpGet("{id}")]
        public ActionResult<Drug> GetDrug(int id)
        {
            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();
            return drug;
        }

        // POST: api/drugs
        [HttpPost]
        public ActionResult<Drug> AddDrug([FromBody] Drug drug)
        {
            if (drug == null)
                return BadRequest();

            _context.Drugs.Add(drug);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetDrug), new { id = drug.Id }, drug);
        }

        // PUT: api/drugs/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateDrug(int id, [FromBody] Drug updatedDrug)
        {
            if (id != updatedDrug.Id)
                return BadRequest();

            var drug = _context.Drugs.Find(id);
            if (drug == null)
                return NotFound();

            // Update properties
            drug.Name = updatedDrug.Name;
            drug.Quantity = updatedDrug.Quantity;
            drug.Price = updatedDrug.Price;

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

            _context.Drugs.Remove(drug);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
