/**
 * 任务跟踪系统测试
 */

const { taskTracker } = require('../src/superpowers/task_tracker');
const fs = require('fs');
const path = require('path');

describe('TaskTracker', () => {
  const testFile = path.join(__dirname, 'test_task_tracker.json');

  beforeEach(() => {
    // 清理测试文件
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    // 重置任务跟踪器
    taskTracker.tasks = {};
  });

  test('should start a task', () => {
    const task = taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    expect(task).toBeTruthy();
    expect(task.id).toBe('task1');
    expect(task.name).toBe('Test Task');
    expect(task.status).toBe('in_progress');
  });

  test('should add a task step', () => {
    // 先开始一个任务
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    
    // 添加步骤
    const step = taskTracker.addTaskStep('task1', 'Step 1', 'Complete step 1');
    expect(step).toBeTruthy();
    expect(step.name).toBe('Step 1');
    expect(step.status).toBe('pending');
  });

  test('should complete a task', () => {
    // 先开始一个任务
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    
    // 添加步骤
    taskTracker.addTaskStep('task1', 'Step 1', 'Complete step 1');
    
    // 完成任务
    const task = taskTracker.completeTask('task1', 'Task completed successfully');
    expect(task).toBeTruthy();
    expect(task.status).toBe('completed');
    expect(task.result).toBe('Task completed successfully');
    expect(task.steps[0].status).toBe('completed');
  });

  test('should get a task', () => {
    // 先开始一个任务
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    
    // 获取任务
    const task = taskTracker.getTask('task1');
    expect(task).toBeTruthy();
    expect(task.id).toBe('task1');
  });

  test('should list tasks', () => {
    // 开始几个任务
    taskTracker.startTask('task1', 'Test Task 1', 'This is test task 1');
    taskTracker.startTask('task2', 'Test Task 2', 'This is test task 2');
    
    // 列出所有任务
    const tasks = taskTracker.listTasks();
    expect(tasks.length).toBe(2);
    
    // 列出进行中的任务
    const inProgressTasks = taskTracker.listTasks('in_progress');
    expect(inProgressTasks.length).toBe(2);
  });

  test('should update task status', () => {
    // 先开始一个任务
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    
    // 更新状态
    const task = taskTracker.updateTaskStatus('task1', 'pending');
    expect(task).toBeTruthy();
    expect(task.status).toBe('pending');
  });

  test('should update step status', () => {
    // 先开始一个任务并添加步骤
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    const step = taskTracker.addTaskStep('task1', 'Step 1', 'Complete step 1');
    
    // 更新步骤状态
    const updatedStep = taskTracker.updateStepStatus('task1', step.id, 'in_progress');
    expect(updatedStep).toBeTruthy();
    expect(updatedStep.status).toBe('in_progress');
  });

  test('should delete a task', () => {
    // 先开始一个任务
    taskTracker.startTask('task1', 'Test Task', 'This is a test task');
    
    // 删除任务
    const success = taskTracker.deleteTask('task1');
    expect(success).toBe(true);
    
    // 验证删除
    const task = taskTracker.getTask('task1');
    expect(task).toBeNull();
  });

  test('should get task statistics', () => {
    // 开始并完成一个任务
    taskTracker.startTask('task1', 'Test Task 1', 'This is test task 1');
    taskTracker.completeTask('task1', 'Task 1 completed');
    
    // 开始另一个任务
    taskTracker.startTask('task2', 'Test Task 2', 'This is test task 2');
    
    // 获取统计信息
    const stats = taskTracker.getTaskStatistics();
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.in_progress).toBe(1);
    expect(stats.pending).toBe(0);
  });
});
