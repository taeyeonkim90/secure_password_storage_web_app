using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace app.DataLayer.Models
{
    public class Data
    {
        public int Id { get; set; }
        public string UserData { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastModified { get; set; }

        [Required]
        public string UserForeignKey {get;set;}

        [ForeignKey(nameof(UserForeignKey))]
        public ApplicationUser User { get; set; }
    }
}