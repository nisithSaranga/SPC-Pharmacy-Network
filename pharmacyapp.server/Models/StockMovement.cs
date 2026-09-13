namespace pharmacyapp.server.Models
{
    public class StockMovement
    {
        public int Id { get; set; }
        public int DrugId { get; set; }
        public Drug? Drug { get; set; }

        // Signed: positive for stock in, negative for stock out
        public int Quantity { get; set; }

        // OpeningBalance | Receipt | OrderPlaced | OrderRejected | Adjustment
        public string Reason { get; set; } = "Adjustment";

        public DateTime Timestamp { get; set; }
        public string? Username { get; set; }
        public int? OrderId { get; set; }
    }
}