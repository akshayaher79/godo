import { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import { List, Checkbox, Button } from 'react-native-paper';

import { useSQLiteContext } from 'expo-sqlite';

import TinyTwoLiner from './TinyTwoLiner';
import { useInputModal } from './InputModalProvider';
import type { Task } from '@/lib/types';


const time_block_starts = ['4am', '8am', '12pm', '4pm', '8pm']
const time_block_ends = ['8am', '12pm', '4pm', '8pm', '12am']

export default function AgendaSection({ sectionIndex }: { sectionIndex: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { openModal } = useInputModal();

  const db = useSQLiteContext();
  useEffect(() => {
    (async function() {
      const tasks = await db.getAllAsync<Task>(
        `SELECT id, title, description, done FROM tasks
          WHERE date(agenda_date) = date('now') AND time_block=${sectionIndex};`);
      setTasks(tasks);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done_tasks = tasks.filter(task => task.done);

  const switchTaskStatusSQL = db.prepareSync(
    "UPDATE tasks SET done = CASE done WHEN 1 THEN 0 ELSE 1 END WHERE id=$id;");
  async function switchTaskStatus(id: number) {
    await switchTaskStatusSQL.executeAsync({$id: id});
    setTasks(staleTasks =>
      staleTasks.map(task => (
        task.id === id ? { ...task, done: !task.done } : task
      ))
    );
  }

  const updateTaskTextSQL = db.prepareSync(
    "UPDATE tasks SET title = $title, description = $description WHERE id=$id;");
  async function updateTaskText(id: number, { title, description }: { title: string; description: string }) {
    await updateTaskTextSQL.executeAsync({ $id: id, $title: title, $description: description });
    setTasks(staleTasks =>
      staleTasks.map(task => (
        task.id === id ? { ...task, title, description } : task
      ))
    );
  }

  const deleteTaskSQL = db.prepareSync(
    "DELETE FROM tasks WHERE $id = id;");
  async function deleteTask(id: number) {
    await deleteTaskSQL.executeAsync({ $id: id });
    setTasks(staleTasks => staleTasks.filter(task => task.id !== id));
  }

  const addTaskSQL = db.prepareSync(
    "INSERT INTO tasks (time_block, title, description) VALUES ($time_block, $title, $description);");
  async function addTask({ title, description }: { title: string; description: string }) {
    const { lastInsertRowId } = await addTaskSQL.executeAsync({ $time_block: sectionIndex, $title: title, $description: description});
    const rows = await db.getAllAsync(`SELECT id, title, description, done FROM tasks WHERE id = ${lastInsertRowId}`);
    setTasks(Array.prototype.concat(tasks, rows));
  }

  const tasks_summary = tasks.map(task => task.title).join(' • ');

  return (
    <List.Accordion
      key={sectionIndex}
      id={`section-${sectionIndex}`}
      title={tasks_summary}
      titleNumberOfLines={2}
      titleStyle={styles.section_title}
      style={styles.section_header}

      left={() => (
        <TinyTwoLiner
          top={time_block_starts[sectionIndex]}
          middle={time_block_ends[sectionIndex]}
          bottom={`${done_tasks.length}/${tasks.length}`} />
      )}
    >
      {tasks.filter(task => !task.done).map((task, itemIndex) => (
        <List.Item
          key={task.id}
          testID={`${sectionIndex}-pending-${itemIndex}`}
          title={task.title}
          description={task.description}
          style={styles.item}
          onPress={() => openModal({
            initialValues: { title: task.title, description: task.description },
            onSubmit: (data) => updateTaskText(task.id, data),
            onDelete: () => deleteTask(task.id)
          })}

          left={props => (
            <Checkbox
              status="unchecked"
              onPress={() => switchTaskStatus(task.id)}
            />
          )}
        />
      ))}
      {done_tasks.map((task, itemIndex) => (
        <List.Item
          key={task.id}
          testID={`${sectionIndex}-done-${itemIndex}`}
          title={task.title}
          description={task.description}
          style={[styles.item, styles.checked_item]}
          onPress={() => openModal({
            initialValues: { title: task.title, description: task.description },
            onSubmit: (data) => updateTaskText(task.id, data),
            onDelete: () => deleteTask(task.id)
          })}

          left={props => (
            <Checkbox
              status="checked"
              onPress={() => switchTaskStatus(task.id)}
            />
          )}
        />
      ))}
      {tasks.length < 6 && (
        <Button onPress={() => openModal({ onSubmit: addTask })}>Add new task</Button>
      )}
    </List.Accordion>
  );
}

const screenHeight = Dimensions.get("window").height - 30;
const NUM_SECTIONS = 5;
const NUM_ITEMS = 6;
const TOTAL_HEIGHT_UNITS = (NUM_SECTIONS * 1) + (NUM_ITEMS * 1.15)
const HEADER_HEIGHT = screenHeight / TOTAL_HEIGHT_UNITS
const ITEM_HEIGHT = (1.15 * screenHeight) / TOTAL_HEIGHT_UNITS

const styles = StyleSheet.create({
  section_title: { fontSize: 13, color: "#555" },
  section_header: { height: HEADER_HEIGHT },
  item: { height: ITEM_HEIGHT, marginLeft: 10 },
  checked_item: { textDecorationLine: "line-through", color: "#555" }
})
