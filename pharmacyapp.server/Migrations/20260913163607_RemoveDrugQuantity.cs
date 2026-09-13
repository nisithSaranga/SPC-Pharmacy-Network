using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pharmacyapp.server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDrugQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Drugs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Drugs",
                type: "int",
                nullable: true);
        }
    }
}
