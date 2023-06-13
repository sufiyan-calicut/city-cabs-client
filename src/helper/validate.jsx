import { toast } from "react-hot-toast";

// -----------------------------------------------------Signup Validation----------------------------------------------------------------

export async function signupValidation(value){

    const error = {}

    if(!value.userName){
        return error.userName = toast.error('UserName Required...!')
    }else if(!value.phone){
        return error.phphoneoneNumber = toast.error('PhoneNumber Required ...!')
    }else if(value.phone.length < 9){
        return error.phone = toast.error('Please Enter a valid Phone Number...!')
    }else if(!value.email){
        return  error.email =toast.error('Email Required...!');
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value.email)){
       return error.email =toast.error('Invalid email....!');
    }else if(!value.password){
        return error.password = toast.error('Password Required ...!')
    }else if(value.password.length < 5){
        return error.password = toast.error('Your Password must contain atleast 5 characters')
    }
}

//-----------------LOGIN VALIDATION-----------------//

export async function loginValidation(value) {
  const error = {};

  if (!value.email) {
    return (error.email = toast.error("Email Required...!"));
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value.email)) {
    return (error.email = toast.error("Invalid Email...!"));
  } else if (!value.password) {
    return (error.password = toast.error("Password Required...!"));
  } else if (value.password.length < 5) {
    return (error.password = toast.error("Invalid Password...!"));
  }
}

// -----------------------------------------------------FORGOT PASSWORD VALIDATION----------------------------------------------------------------


// Email validation
export async function emailValidation(value){
    const error = {}

    if(!value.email){
        return error.email = toast.error('Email Required...!')
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value.email)){
        return error.email = toast.error('Invalid Email...!')
    }
}

// Password validation
export async function passwordValidation(value){
    const error = {}
    if(!value.password){
        return error.password = toast.error('Password Required ...!')
    }else if(value.password.length < 5){
        return error.password = toast.error('Your Password must contain atleast 5 characters')
    }else if(!value.confirmPassword){
        return error.confirmPassword = toast.error('Please Confirm your password')
    }else if(value.confirmPassword != value.password){
        return error.confirmPassword = toast.error('Password Doesnot Match')
    }
}