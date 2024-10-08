export type RootStackParamList = {
    Login: undefined;
    HomePage: undefined;
    AddRecipe: { newRecipe?: NewRecipe };  
    RecipeList: { newRecipe?: Recipe };    
    RecipeDetails: { recipeId: string };
};
export interface Recipe {
    id: string;
    name: string;
    description: string;
    image?: any;
    ingredients: string[];  
    instructions: string;   
    course: string;         
    price: number;          
};
export type NewRecipe = {
    name: string;
    ingredients: string[];
    instructions: string;
};