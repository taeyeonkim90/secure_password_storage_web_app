using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace app.DataLayer.Models
{
    public class Data
    {
        public int Id { get; set; }
        public string UserData { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastModified { get; set; }
        
    }
}