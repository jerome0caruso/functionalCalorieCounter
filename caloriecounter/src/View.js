import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { 
  showFormMsg,
  mealInputMsg,
  caloriesInputMsg,
  saveMealMsg,
} from './Update';

const {pre, div, h1, button, form, input, label, table, thead, tbody, tr, th, td} = hh(h);


  function view(dispatch, model) {
    return div({ className: 'mw6 center' }, [
      h1({ className: 'f2 pv2 bb' }, 'Calorie Counter'),
      formView(dispatch, model),
      pre(JSON.stringify(model, null, 2)),
    ]);
  }

  function formView(dispatch, model) {
    const { description, calories, showForm } = model;
    if (showForm) {
      return form(
        {
          className: 'w-100 mv2',
          onsubmit: e => {
            e.preventDefault();
            dispatch(saveMealMsg);
          },
        },
        [
          fieldSet('Meal', description,
            e => dispatch(mealInputMsg(e.target.value))
          ),
          fieldSet('Calories', calories || '',
            e => dispatch(caloriesInputMsg(e.target.value))
          ),
          buttonSet(dispatch),
        ],
      );
    }
    return button( 
        { 
          className: 'f3 pv2 ph3 bg-blue white bn',
          onclick: () => dispatch(showFormMsg(true)),
        },
        'Add Meal',
      );
  }

  

  
  function fieldSet(labelText, inputValue, oninput) {
    return div([
      label({ className: 'db mb1' }, labelText),
      input({
        className: 'pa2 input-reset ba w-100 mb2',
        type: 'text',
        value: inputValue,
        oninput
      }),
    ]);
  }
  
  function buttonSet(dispatch) {
    return div([
      button(
        {
          className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
          type: 'submit',
        },
        'Save',
      ),
      button(
        {
          className: 'f3 pv2 ph3 bn bg-light-gray dim',
          type: 'button',
          onclick: () => dispatch(showFormMsg(false)),
        },
        'Cancel',
      ),
    ]);
  }
  

  // table

function cell(tag, className, value) {
  return tag({className}, value);
}
//

//HEADER
const tableHeader = thead([
    tr([
      cell(th, 'pa2 tl b', 'Meal'),
      cell(th, 'pa2 tr b', 'Calories'),
      cell(th, '', '')
    ])
      
]);

//Footer
//Pipe takes the first fn return and passes them to next function and so on,  The param for pipe is the meals call at end of fn R.pipe()(meals)
// R.map extracts the numbers from the arr then reduce adds the total and returns that to total
function totalRow(className, meals) {
  const total = R.pipe(
  R.map(meal => meal.calories),
  R.sum,
  )(meals);
  return tr({ className: 'bt b' }, [
    cell(td, 'pa2 tr', 'Total:'),
    cell(td, 'pa2 tr', total),
    cell(td, '', '')
  ]);
}

//MEALS 

function mealRow(dispatch, className, meal) {
  return tr({ className }, [
    cell(td, 'pa2', meal.description),
    cell(td, 'pa2 tl ', meal.calories),
    cell(td, 'pa2 tl ', []),
  ]);
}

function mealsBody(dispatch, className, meals) {
  const rows = R.map(R.partial(mealRow, [dispatch, 'stripe-dark']), meals);
  const rowsWithTotal = [...rows, totalRow(meals)];

  return tbody({ className }, [rowsWithTotal]);
}
//TABLE
function tableView(dispatch, meals) {
    if(meals.length === 0) {
      return div({className: 'mv2 i black-50'}, 'No meals to display...');
    }
    return table({className: 'mv2 w-100 collapse'}, [
        tableHeader, 
        mealsBody(dispatch, '', meals)
    ]);

}
//

export default view;