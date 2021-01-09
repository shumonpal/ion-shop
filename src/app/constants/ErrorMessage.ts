export const LOGIN = {
    'email' : {
        'required': 'E-mail field is required',
        'email': 'Please enter a valid e-mail address'
    },
    'password' : {
        'required': 'Password field is required',
        'minlength': 'Password must be at least 6 characters long',     
        'maxlength': 'Password maximum length 20 characters only'
    },
};

export const REGISTRATION = {
    'name' : {
        'required': 'Name field is required',
        'minlength': 'Name must be at least 6 characters long',     
        'maxlength': 'Name maximum length 20 characters only'
    },
    'email' : {
        'required': 'E-mail field is required',
        'email': 'Please enter a valid e-mail address'
    },
    'password' : {
        'required': 'Password field is required',
        'minlength': 'Password must be at least 6 characters long',     
        'maxlength': 'Password maximum length 20 characters only'
    },
};
export const EDITADDRESSFORM = {
    'country' : {
        'required': 'Country field is required',     
        'maxlength': 'Country maximum length 20 characters only'
    },
    'state' : {
        'required': 'State field is required',
        'maxlength': 'Password maximum length 30 characters only'
    },
    'address' : {
        'required': 'Address field is required',  
        'maxlength': 'Address maximum length 100 characters only'
    },
    'phone' : {
        'required': 'Phone field is required',  
        'maxlength': 'Phone maximum length 20 characters only'
    },
};