import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../dbSchemas/userSchema.mjs";
import { comparePassword } from "../utils/helpers.mjs";
//serilization
passport.serializeUser((user,done) => {
  done(null,user.id)
})
//desilirization
passport.deserializeUser(async(id,done)=>{
    try {
      const findUser = await User.findById(id);
      if(!findUser) throw new Error( `User not found`);
      done(null,findUser);      
    } catch (error) {
      done(error,null);
    }
})
//local authetication
export default passport.use(
  new Strategy({usernameField: "email"},async(email,password,done) => {
    try {
        const findUser = await User.findOne({email});
        if(!findUser) throw new Error( `User not found`);
        if(!comparePassword(password,findUser.password)) throw Error(`Envalide Password`)
        done(null,findUser);
       
    } catch (error) {
        done(error,null);
    }
  })
)