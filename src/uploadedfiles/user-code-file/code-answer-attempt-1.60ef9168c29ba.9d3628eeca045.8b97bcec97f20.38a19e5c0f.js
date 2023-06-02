const calculateBMI = (height,weight)=>{
    let bmi = weight/(height*height)
    
    if(bmi < 18.5){
        return 'underweight'
    }
    else if(bmi <= 24.9){
        return 'normal'
    }
    else if(bmi <= 29.9){
        return 'overweight'
    }
}
module.exports=calculateBMI