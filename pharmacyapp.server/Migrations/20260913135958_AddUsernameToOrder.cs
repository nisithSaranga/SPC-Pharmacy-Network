using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pharmacyapp.server.Migrations
{
    /// <inheritdoc />
    public partial class AddUsernameToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "Orders");
        }
    }
}
