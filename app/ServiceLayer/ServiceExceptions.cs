using System;

namespace app.ServiceLayer
{

    /*
        Exceptions
     */
    public class ServiceException: Exception
    {
        public ServiceException() { }

        public ServiceException(string message) : base(message) { }

        public ServiceException(string message, Exception inner) : base(message, inner) { }
    }

    public class AuthServiceException: ServiceException
    {
        public AuthServiceException() { }

        public AuthServiceException(string message) : base(message) { }

        public AuthServiceException(string message, Exception inner) : base(message, inner) { }
    }

    public class DataServiceException: ServiceException
    {
        public DataServiceException() { }

        public DataServiceException(string message) : base(message) { }

        public DataServiceException(string message, Exception inner) : base(message, inner) { }
    }
}