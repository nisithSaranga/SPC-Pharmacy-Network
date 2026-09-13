namespace pharmacyapp.server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int DrugId { get; set; }
        public Drug? Drug { get; set; }  
        public int? Quantity { get; set; }         
        public int PharmacyId { get; set; }
        public Pharmacy? Pharmacy { get; set; }  
        public DateTime? OrderDate { get; set; }   
        public string? Status { get; set; }        
        public string? Username { get; set; }
    }
}
