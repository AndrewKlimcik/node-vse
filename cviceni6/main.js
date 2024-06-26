var express = require('express')
const app = express();

let todos = [
    {
        id: 1,
        title: 'Zajít na pivo',
        done: true,
    },
    {
        id: 2,
        title: 'Vrátit se z hospody',
        done: false,
    },
]

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log('Incomming request', req.method, req.url)
    next()
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Todos',
        todos,
    })
})

app.post('/add-todo', (req, res) => {
    const todo = {
        id: todos.length + 1,
        title: req.body.title,
        done: false,
    }

    todos.push(todo)

    res.redirect('/')
})

app.get('/remove-todo/:id', (req, res) => {
    todos = todos.filter((todo) => {
        return todo.id !== Number(req.params.id)
    })

    res.redirect('/')
})

app.get('/toggle-todo/:id', (req, res) => {
    const todo = todos.find((todo) => {
        return todo.id === Number(req.params.id)
    })

    todo.done = !todo.done

    res.redirect('/')
})

//ukol5
app.get('/todo/:id', (req, res) => {
    const todo = todos.find(todo => {
        return todo.id === Number(req.params.id);
    })
    if (!todo) {
        return res.status(404).send('Todo not found');
    }
    res.render('todo-detail', {
        todo,
    });
})

app.post('/update-todo/:id', (req, res) => {
    const todo = todos.find(todo => {
        return todo.id === Number(req.params.id);
    })
    if (todo) {
        todo.title = req.body.title
    }
    
    res.redirect(`/todo/${req.params.id}`);
})

app.use((req, res) => {
    res.status(404)
    res.send('404 - Page not found')
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.send('500 - Server error')
})

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
})