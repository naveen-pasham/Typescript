import {Router} from 'express';

import {Todo} from '../models/todo';

let todos : Todo[]=[];
const router=Router();
router.get('/',(req,res,next)=>{
    res.status(200).json({todos:todos})
});

router.post('/todo',(req,res,next)=>{
    const newTodo: Todo= {
        id: new Date().toISOString(),
        text:req.body.text
    }

    todos.push(newTodo);

    res.status(201).json({message:'added Todo', todo:newTodo, todos:todos});
})

router.put('/todos/:todoId',(req,res,next)=>{
    const tId= req.params.todoId;
    const todoIndex=todos.findIndex((todoItem)=>  todoItem.id===tId);
    if(todoIndex >=0){
        todos[todoIndex]={id:todos[todoIndex].id, text:req.body.text};
        return res.status(200).json({message:'Updated Todo', todos:todos});
    }
    res.status(404).json({message:'Item not found'});
});

router.delete('/todos/:todoId',(req,res,next)=>{
    const tId= req.params.todoId;
    const todoIndex=todos.findIndex((todoItem)=>  todoItem.id===tId);
    if(todoIndex >=0){
        todos=todos.filter((todoItem)=>todoItem.id !==tId);
        return res.status(200).json({message:'Deleted Todo', todos:todos})
    }
    res.status(404).json({message:'Item not found'});
});



export default router;