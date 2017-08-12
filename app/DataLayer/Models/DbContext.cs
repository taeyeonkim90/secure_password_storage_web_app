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

        public DbSet<PwInfo> PwInfos { get; set; }
        public DbSet<Jti> Jtis {get; set;}
    }
}