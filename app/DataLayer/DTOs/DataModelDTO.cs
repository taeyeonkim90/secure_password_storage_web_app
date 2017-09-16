using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace app.DataLayer.Models
{
    public class DataDTO
    {
        public int Id { get; set; }
        public string UserData { get; set; }
    }
}