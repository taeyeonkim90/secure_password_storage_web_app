using System;

namespace app.ServiceLayer{

    /*
        Exceptions
     */
    public class ASUserNotFoundException: ASVerifyUserFailureException
    {        
        public ASUserNotFoundException() { }

        public ASUserNotFoundException(string message) : base(message) { }

        public ASUserNotFoundException(string message, Exception inner) : base(message, inner) { }
    }

    public class ASPasswordNotCorrectException: ASVerifyUserFailureException
    {
        public ASPasswordNotCorrectException() { }

        public ASPasswordNotCorrectException(string message) : base(message) { }

        public ASPasswordNotCorrectException(string message, Exception inner) : base(message, inner) { }
    }    

    public class ASEmailVerificationFailureException: ASVerifyUserFailureException
    {
        public ASEmailVerificationFailureException() { }

        public ASEmailVerificationFailureException(string message) : base(message) { }

        public ASEmailVerificationFailureException(string message, Exception inner) : base(message, inner) { }
    }

    public class ASEmailAlreadyVerifiedException: ASVerifyUserFailureException
    {
        public ASEmailAlreadyVerifiedException() { }

        public ASEmailAlreadyVerifiedException(string message) : base(message) { }

        public ASEmailAlreadyVerifiedException(string message, Exception inner) : base(message, inner) { }
    }
    public class ASVerifyUserFailureException: AuthException
    {
        public ASVerifyUserFailureException() { }

        public ASVerifyUserFailureException(string message) : base(message) { }

        public ASVerifyUserFailureException(string message, Exception inner) : base(message, inner) { }
    }

    public class ASTokenCreateFailureException: AuthException
    {
        public ASTokenCreateFailureException() { }

        public ASTokenCreateFailureException(string message) : base(message) { }

        public ASTokenCreateFailureException(string message, Exception inner) : base(message, inner) { }
    }
    public class AuthException: Exception
    {
        public AuthException() { }

        public AuthException(string message) : base(message) { }

        public AuthException(string message, Exception inner) : base(message, inner) { }
    }
}