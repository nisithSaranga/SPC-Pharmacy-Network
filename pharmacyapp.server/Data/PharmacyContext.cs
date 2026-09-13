using Microsoft.EntityFrameworkCore;
using pharmacyapp.server.Models;

namespace pharmacyapp.server.Data
{
    public class PharmacyContext : DbContext
    {
        public PharmacyContext(DbContextOptions<PharmacyContext> options) : base(options) { }

        public DbSet<Drug> Drugs { get; set; }
        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Drug>()
                .Property(d => d.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Pharmacy>()
                .Property(p => p.Revenue)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Drug>()
                .HasIndex(d => d.Name)
                .IsUnique();

            modelBuilder.Entity<StockMovement>()
                .HasOne(m => m.Drug)
                .WithMany()
                .HasForeignKey(m => m.DrugId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}