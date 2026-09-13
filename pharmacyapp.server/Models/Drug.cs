namespace pharmacyapp.server.Models
{
    public class Drug
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
