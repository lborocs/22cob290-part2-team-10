<?php

// hardcoded

/**
 * @return string[]
 */
function get_projects(string $email, int $count = 15): array
{
  return array_map(fn($num): string => 'Project ' . $num, range(1, 15));
}

// not finished, need: estimated hours, deadline, ...
class Task
{
  public string $title;

  public string $description;

  public string $assignee;

  /**
   * @var string[] $tags
   */
  public array $tags;
}

// not finished, need: project leader's name, ...
class ProjectData
{
  /**
   * @var Task[]
   */
  public array $todo;

  /**
   * @var Task[]
   */
  public array $in_progress;

  /**
   * @var Task[]
   */
  public array $code_review;

  /**
   * @var Task[]
   */
  public array $completed;
}

/**
 * @return ProjectData
 */
function _get_project_tasks(string $project_name): object
{
  $todo = [
    'title' => 'daadad',
    'description' => 'awdwada',
    2,
  ];
  $in_progress = [

  ];
  $code_review = [

  ];
  $completed = [

  ];

  return (object) [
    'todo' => $todo,
    'in_progress' => $in_progress,
    'code_review' => $code_review,
    'completed' => $completed,
  ];
}

// cheat way of getting type system to think we're returning `ProjectData` not `object`
// https://stackoverflow.com/a/54481076
function get_project_tasks(string $project_name): ProjectData
{
  return _get_project_tasks($project_name);
}

function __test_typing()
{
  $projectData = get_project_tasks("Project 7");

  $todo = $projectData->todo;
  $in_progress = $projectData->in_progress;
  $code_review = $projectData->code_review;
  $completed = $projectData->completed;

  foreach ($todo as $task) {
    echo $task->title;
  }
}
