using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace app.DataLayer.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUserDTO
    {
        public string UserName {get; set; }
        public string Password {get; set; }
    }
}
