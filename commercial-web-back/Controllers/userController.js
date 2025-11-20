import User from "../Modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();    
const JWT_SECRET = process.env.JWT_SECRET


// ChatGPT generated code for logInUser function
export function logInUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    // const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            // user not found
            if (!user) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            // compare given password with hashed password
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            // build payload for token
            const payload = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            };

            // create token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "150h" });

            // send token to client
            return res.json({
                message: "Authentication successful",
                token: token,
                userdata : payload
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err.message });
        });
}


export function getUser(req, res) {
    // 1. No token / no decoded user
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized Access - No Token / User" });
    }

    // 2. No role in token
    if (!req.user.role) {
        return res.status(401).json({ message: "Unauthorized Access - No Role Assigned" });
    }

    // 3. Not admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden Access - Admins Only" });
    }

    // 4. Is admin → return all users
    User.find().select('-password').then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Server error", error: err.message });
        });
}


// ChatGPT generated code for createUser function
export async function createUser(req, res) {
    const { email, password, firstName, lastName, role } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            message: "Email, password, first name, and last name are required"
        });
    }

    try {
        // Normalize email (recommended)
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered. Please use a different email."
            });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = new User({
            email: normalizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: hashedPassword,
            role: role || "customer",  // default to customer if not provided
            // other defaults from schema will be applied automatically
        });

        // Save user
        await newUser.save();

        // Success response (never send password back!)
        res.status(201).json({
            message: "User created successfully",
            user: {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                image: newUser.image,
                isBlocked: newUser.isBlocked,
                iaEmailVerified: newUser.iaEmailVerified
            }
        });

    } catch (err) {
        // Handle duplicate email from MongoDB (in case of race condition)
        if (err.code === 11000 || err.message.includes("duplicate key")) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        console.error("Create user error:", err);
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
}



// My code for createUser function
// export function createUser (req,res){

//     const data = req.body;
//     const hashedPassword = bcrypt.hashSync(data.password,10);   // 10 means password hash 10 times
//     // res.json({
//     //     hashedPassword : hashedPassword
//     // })
//     const user = new User(
//         {
//             email: data.email,
//             firstName: data.firstName,
//             lastName: data.lastName,
//             password: hashedPassword,
//             role: data.role
//         }
//     )
//     console.log(user)
//     user.save().then(() => {
//         res.json( 
//             { message : "user created successfully" }
//                 )
//             }
//         )
//     }






// My code for logInUser function
// export function logInUser(req,res){
//     const email = req.body.email;
//     const password = req.body.password;
//     User.find({email : email}).then(
//             (user) => {
//                 if (user==null){

//                     return res.status(401).json({message : "Authentication failed"})

//                 }else{

//                     // console.log(user[0])


//                     const isPasswordValid = bcrypt.compareSync(password,user[0].password)
                    
                    
//                     // res.json({matching : isPasswordValid})  // just for testing purpose

//                     if (isPasswordValid){
//                         const payload = {
//                             email : user[0].email,
//                             firstName : user[0].firstName,
//                             lastName : user[0].lastName,
//                             role : user[0].role
//                         }

//                         const token = jwt.sign(payload,"secretKey2000")
                    
                        
//                         res.json(
//                             {
//                                 message : "Authentication successful",
//                                 token : token
//                             }
//                         )

//                     }else{
//                         return res.status(401).json({message : "Authentication failed"})
//                     }
//                 }
//             }
//         )
//     }