const Header = ({ title }) => <h2>{title}</h2>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(item => 
        <Part key={item.id} name={item.name} exercises={item.exercises}/>
        )}
    </>
  )
}

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>
 
const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)
  return (
    <p><b>Total of {total} exercises</b></p>
  )
}

const Course = ({ course }) => {
  return (
      <div>
        <Header title={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts} />
      </div>
  ) 
}

export default Course