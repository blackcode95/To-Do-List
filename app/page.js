"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';


const page = () => {
  const [title, settitle] = useState("")
  const [description, setdesc] = useState("")
  const [mainTask, setMainTask] = useState([])
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setMainTask(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };


  const submitHandler = (e) => {
    e.preventDefault()
    const taskData = { title, description };

    if (editId) {
      // Update task
      axios.put(`http://localhost:5000/tasks/${editId}`, taskData)
        .then(response => {
          setMainTask(mainTask.map(task => task.id === editId ? response.data : task));
          setEditId(null);
        })
        .catch(error => console.error('Error updating task:', error));
    }
    else {
      // Add new task
      axios.post('http://localhost:5000/tasks', taskData)
        .then(response => setMainTask([...mainTask, response.data]))
        .catch(error => console.error('Error adding task:', error));
    }

    settitle("")
    setdesc("")
  }


  const deleteHandler = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setMainTask(mainTask.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  }

  const editHandler = (task) => {
    settitle(task.title);
    setdesc(task.description);
    setEditId(task.id);
  };

  let renderTask = <h2>No Task Available</h2>

  if (mainTask.length > 0) {

    renderTask = mainTask.map((t) => {
      return (
        <li key={t.id} className='flex items-center justify-between mb-5'>
          <div className='flex items-center justify-between w-2/3'>
            <h5 className='text-2xl font-semibold'>
              {t.title}
            </h5>
            <h6 className='text-lg font-semibold'>
              {t.description}
            </h6>
          </div>
          <button onClick={() => editHandler(t)}
            className='bg-yellow-400 text-white px-4 py-2 rounded font-bold mr-2'>
            Edit
          </button>
          <button onClick={() => deleteHandler(t.id)}
            className='bg-red-400 text-white px-4 py-2 rounded font-bold'>
            Delete
          </button>
        </li>
      );
    });
  }


  return (
    <>
      <h1 className='bg-black text-white p-5 text-5xl font-bold text-center'>
        To-Do-List
      </h1>
      <form onSubmit={submitHandler}>

        <input type='text'
          className='text-2xl border-zinc-800 border-4 m-8 px-4 py-2'
          placeholder='Enter task here...'
          value={title}
          onChange={(e) => {
            settitle(e.target.value)
          }} />
        <input type='text'
          className='text-2xl border-zinc-800 border-4 m-8 px-4 py-2'
          placeholder='Description'
          value={description}
          onChange={(e) => {
            setdesc(e.target.value)
          }}
        />
        <button className='bg-black text-white px-4 py-3 m-5 text-2xl font-bold rounded'>
          Add task
        </button>
      </form>
      <hr />
      <div className=' p-8 bg-slate-300'>
        <ul>
          {renderTask}
        </ul>
      </div>
    </>
  )
}

export default page
