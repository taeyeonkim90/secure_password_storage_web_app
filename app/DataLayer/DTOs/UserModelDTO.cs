using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace app.DataLayer.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email {get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password {get; set; }
    }
}
