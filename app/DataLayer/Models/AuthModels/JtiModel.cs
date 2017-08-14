using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace app.DataLayer.Models
{
    public class Jti
    {
        public int Id { get; set; }
        public string Uuid { get; set; }
        public DateTime ExpiryTime {get; set; }
    }
}