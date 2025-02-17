import expressAsyncHandler from "express-async-handler"

let categories=[
    'Technology',
    'Health & Fitness',
    'Lifestyle',
    'Travel',
    'Food & Drink',
    'Business & Finance',
    'Education',
    'Entertainment',
    'Fashion',
    'Sports',
    'Science',
    'Art & Culture',
    'Personal Development',
    'Parenting',
    'News & Politics',
    'Music',
    'Gaming',
    'Environment',
    'Self-Improvement',
    'Books & Literature',
    'Relationships',
    'History',
    'Photography',
    'Tech Reviews',
    'Productivity',
    'DIY (Do It Yourself)',
    'Social Media',
    'Mental Health',
    'Philosophy',
    'Pets'
  ]

export const getCategories=expressAsyncHandler(async(req,res)=>{
    res.status(200).json(categories)
})