import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../helpers/utility';

const initialState = {
    ingredients: null,
    totalPrice: 4000,
    error: false,
    building: false
}

const reducer = (state = initialState, action) => {
    if (action.type === actionTypes.ADD_INGREDIENT) {
        const updatedIngredients = state.ingredients ? [...state.ingredients] : []
        const itemIndex = updatedIngredients.findIndex(i => i.id === action.ingredientId)
        updatedIngredients[itemIndex].count = updatedIngredients[itemIndex].count ? updatedIngredients[itemIndex].count + 1 : 1
        return updateObject(state, {
            ingredients: [...updatedIngredients],
            totalPrice: state.totalPrice + updatedIngredients[itemIndex].price,
            building: true
        })
    }
    if (action.type === actionTypes.REMOVE_INGREDIENT) {
        const updatedIngredients = state.ingredients ? [...state.ingredients] : []
        const itemIndex = updatedIngredients.findIndex(i => i.id === action.ingredientId)
        updatedIngredients[itemIndex].count = updatedIngredients[itemIndex].count ? updatedIngredients[itemIndex].count - 1 : 0 
        return updateObject(state, {
            ingredients: [...state.ingredients],
            totalPrice: state.totalPrice - updatedIngredients[itemIndex].price,
            building: true
        })
    }
    if (action.type === actionTypes.SAVE_INGREDIENT) {
        return updateObject(state, {
            ingredients: action.ingredients,
            error: false,
            totalPrice: 4000,
            building: false
        })
    }
    if (action.type === actionTypes.FETCH_INGREDIENT_FAILED) {
        return updateObject(state, {error: true})
    }
    return state
}

export default reducer;