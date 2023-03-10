import { Session } from "@supabase/supabase-js";

import { Motion } from "@motionone/solid"

import { animate, spring } from "motion";
import Header from "./components/Header";
import { FaRegularCalendar, FaRegularFlag, FaRegularSquareCheck, FaSolidCircleInfo, FaSolidPlus, FaSolidSquareCheck } from "solid-icons/fa";
import { createEffect, createMemo, createSignal, For, JSXElement, Show } from "solid-js";

import { Task } from "./types";
import { AiOutlineHourglass, AiOutlineUnorderedList } from "solid-icons/ai";
import CreateTask from "./CreateTask";
import { BsStar } from "solid-icons/bs";


export default function(props: {session: Session}) {
  const months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "]


  const [creatingTask, setCreatingTask] = createSignal(false)

  return (
    <div class="pt-40">

      <CreateTask show={creatingTask()} session={props.session} close={() => setCreatingTask(false)}/>

      <Header>
        <h1 
          class="text-primary text-5xl font-black"
          style={{
            "text-shadow": "0px 0px 10px rgba(0, 0, 0, 0.25)"
          }}
        >{months[new Date().getMonth()] + " " + new Date().getDate()}</h1>
        <h3 class="text-secondary font-bold">Hi {props.session.user.email}, let's plan your day</h3>

        <FaSolidCircleInfo size={30} class="fill-primary absolute right-6 top-12" />
      </Header>

      {/* TODO: Status section */ }

      <div class="grid grid-cols-2 gap-2 mt-5 px-3">
        <PlanningIndicator
          icon={<BsStar size={16} class="fill-primary" />} 
          description={<><strong class="text-primary font-extrabold">72%</strong> of tasks have meaning</>} 
          indicatorsections={[
            {color: (endPercentage: number) => endPercentage > 70 ? "green" : "red", endPercentage: 80},
            {color: (endPercentage: number) => endPercentage > 70 ? "green" : "red", endPercentage: 100},
          ]}
        />
      </div>

      <div class="flex flex-row justify-start items-center gap-2 mt-5 px-8">
        <AddTaskButton onClick={() => setCreatingTask(true)}>Add Task</AddTaskButton>
      </div>

      <div class="rounded-tl-3xl rounded-tr-3xl bg-background-secondary mt-5 h-screen"> {/* TODO: Fix this height? */}
        <div class="flex flex-row justify-start gap-2 items-center p-5">
          <FaRegularSquareCheck size={30} />
          <h1 class="text-2xl font-bold text-primary">Your tasks for today</h1>
        </div>


        <PriorityLabel importance="High" urgency="High" />
        <Tasks filteredTasks={[]} />

        <PriorityLabel importance="High" urgency="Low" />
        <Tasks filteredTasks={[]} />

        <PriorityLabel importance="Low" urgency="High" />
        <Tasks filteredTasks={[]} />

        <PriorityLabel importance="Low" urgency="Low" />
        <Tasks filteredTasks={[]} />

      </div>
    </div>
  )
}


function AddTaskButton(props: {children: JSXElement, onClick: () => void}) {
  return (
    <div onClick={props.onClick} class="rounded-full px-3 py-1 flex-row flex items-center justify-center gap-2 bg-background-secondary border-2 border-neutral-300 shadow-md font-semibold text-xl text-primary">
      <FaSolidPlus size={20} class="fill-primary" />
      {props.children}
    </div>
  )
}

type Level = "High" | "Low"
function PriorityLabel(props: {importance: Level, urgency: Level}) {
  return (
    <div class="flex justify-start mt-2 px-5 -mb-6 items-center gap-2">
      <div class="bg-white text-secondary p-2 px-2 rounded-full shadow-sm"> 
        {props.importance} Importance
      </div>
      <div class="bg-white text-secondary p-2 px-2 rounded-full shadow-sm"> 
        {props.importance} Urgency
      </div>
    </div>
  )
}

function Tasks(props: {filteredTasks: Task[]}) {


  const testTasks: Task[] = [ 
    {
      id: crypto.randomUUID(),
      date: new Date(),
      name: "Test Task",
      description: "This is a test task",
      time: 1,
      duration: 2,
      priority: 3,
      completed: false
    },
    {
      id: crypto.randomUUID(),
      date: new Date(),
      name: "USACO",
      description: "Do USACO practice",
      time: 1,
      duration: 2,
      priority: 3,
      completed: false
    },
    {
      id: crypto.randomUUID(),
      date: new Date(),
      name: "USACO",
      description: "Do USACO practice",
      time: 1,
      duration: 2,
      priority: 3,
      completed: false
    },
  ]

  return (
    <div class="grid grid-flow-col justify-start gap-3 mt-5 px-5 py-5 overflow-x-scroll">
      <For each={testTasks}>
        {(task) => <TaskDisplay task={task} />}
      </For>
    </div>
  )
}

function TaskDisplay(props: {task: Task}) {
  const date = () => props.task.date.getDate() === new Date().getDate() ? "Today" : props.task.date.getDate() + " " + props.task.date.getMonth()

  // TODO: Figure out subtasks
  return (
    <div class="rounded-2xl shadow-lg bg-white h-36 w-44">
      <div class="flex flex-row justify-start items-center gap-2 px-3 mt-2 mb-1">
        <FaRegularFlag size={18} class="fill-red-400" />
        <div class="flex flex-row items-center justify-center px-3 py-1 gap-2 bg-neutral-100 rounded-full text-secondary text-sm">
          <FaRegularCalendar size={18} class="fill-secondary" />
          {date()}
        </div>
      </div>

      <h1 class="mx-auto px-2">{props.task.name}</h1>

      <p class="text-secondary px-2">{props.task.description}</p>

      <div class="flex flex-row justify-start items-center gap-2 px-3 mt-2 mb-1">
        <div class="flex flex-row items-center justify-center px-3 py-1 gap-1 bg-neutral-100 rounded-full text-secondary">
          <AiOutlineHourglass size={18} class="fill-secondary" />
          {props.task.time}h
        </div>
      </div>
    </div>
  )
}

type Indicatorsection = {
  startPercentage?: number,
  endPercentage: number,
  color: (end: number) => string
}

function PlanningIndicator(props: {icon: JSXElement, description: JSXElement, indicatorsections: Indicatorsection[]}) {
  const sortedIndicatorSections = createMemo(() => props.indicatorsections.sort((a, b) => a.endPercentage - b.endPercentage))

  return (

    <div class="rounded-lg bg-background-secondary px-2 py-2">
      <div class="flex flex-row justify-start items-center gap-1 text-[10px] text-secondary">
        {props.icon}
        {props.description}
      </div>

      <div class="w-[90%] bg-white rounded-full h-2 mx-auto mt-1">
        <For each={sortedIndicatorSections()}>
          {(item, index) => 
            <Motion.div
              transition={{duration: 0.5, easing: spring()}}
              animate={{width: [0, `${item.endPercentage - (item.startPercentage ?? 0)}%`]}}
              class="h-2"
              style={{
                width: `${item.endPercentage - (item.startPercentage ?? 0)}%`,
                "margin-left": `${item.startPercentage ?? props.indicatorsections[index() -1]?.endPercentage}%`,
                "background-color": item.color(item.endPercentage),
              }}
              classList={{
                "rounded-l-full": index() === 0,
                "rounded-r-full": item.endPercentage === 100
              }}
            />
          }
        </For>
      </div>
    </div>
  )
}
