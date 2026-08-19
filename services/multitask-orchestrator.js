import { agentEvents } from '../ai-agent.js';

export class MultitaskOrchestrator {
  /**
   * Thực thi danh sách nhiều tác vụ con song song (Parallel Subtasks)
   */
  async executeParallelTasks(tasks = [], toolExecutor) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return { success: false, message: 'Danh sách tác vụ rỗng.' };
    }

    console.log(`⚡ [MULTITASK ORCHESTRATOR] Bắt đầu thực thi đồng thời ${tasks.length} tác vụ song song...`);
    agentEvents.emit('multitask_started', { taskCount: tasks.length });

    const promises = tasks.map(async (task, index) => {
      const startTime = Date.now();
      try {
        console.log(`  ▶️ [Task #${index + 1}] Bắt đầu: "${task.title || task.tool}"`);
        const result = await toolExecutor(task.tool, task.args);
        const duration = Date.now() - startTime;
        console.log(`  ✅ [Task #${index + 1}] Hoàn thành (${duration}ms)`);
        return {
          index: index + 1,
          title: task.title || task.tool,
          tool: task.tool,
          success: true,
          result,
          duration
        };
      } catch (err) {
        return {
          index: index + 1,
          title: task.title || task.tool,
          tool: task.tool,
          success: false,
          error: err.message,
          duration: Date.now() - startTime
        };
      }
    });

    const results = await Promise.allSettled(promises);
    const fulfilledResults = results.map(r => r.value || { success: false, error: r.reason?.message });

    agentEvents.emit('multitask_completed', { results: fulfilledResults });

    return {
      success: true,
      taskCount: tasks.length,
      results: fulfilledResults
    };
  }
}

export const multitaskOrchestrator = new MultitaskOrchestrator();
