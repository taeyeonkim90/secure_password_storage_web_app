using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Collections.Generic;
using app.DataLayer.Models;

namespace app.DataLayer.Models
{    public class ApplicationContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                        .HasOne( u => u.Data)
                        .WithOne( d => d.User )
                        .HasForeignKey<Data>( d => d.UserForeignKey );
        }
        
        public DbSet<Data> Datas { get; set; }
        public DbSet<Jti> Jtis {get; set;}
    }
}