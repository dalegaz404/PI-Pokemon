export default function validations(input, pokemonNames) {
    let errors = [];
    let RegExpression = /^[a-zA-Z\s]*$/;

    if(!input.name) {
        errors.name = 'Name is required'
    } else if(pokemonNames.includes(input.name)) {
        errors.name = 'That Pokemon name already exists'
    } else if(input.name.length < 4 || input.name.length > 15) {
        errors.name = 'Name must be longer than three characters... And less than 15!'
    } else if(!RegExpression.test(input.name)) {
        errors.name = 'Special characters and numbers are not allowed'
    }

    if(input.hp === 0 || input.attack === 0 || input.defense === 0 || input.speed === 0 || input.height === 0 || input.weight === 0) {
        errors.hp = 'Choose all the stats!'
    }

    return errors
}