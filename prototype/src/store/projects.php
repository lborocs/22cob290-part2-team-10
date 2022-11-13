<?php

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

// not finished, need: manager, project leader, ...
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

// hardcoded

/**
 * @return string[]
 */
function get_project_names(string $email, int $count = 15): array
{
  return array_map(fn($num): string => 'Project ' . $num, range(1, 15));
}

/**
 * @return ProjectData
 */
function get_project_data(string $project_name): object
{
  $todo = [
    [
      'title' => 'Title',
      'description' => 'You can move these elements between the containers',
      'assignee' => 'alice',
      'tags' => [
        'Tag1',
        'Tag2',
      ],
    ],
    [
      'title' => 'Title2',
      'description' => 'You can move these elements between the containers',
      'assignee' => 'alice',
      'tags' => [
        'Tag1',
        'Tag2',
      ],
    ],
  ];

  $in_progress = [
    [
      'title' => 'In Progress',
      'description' => 'You can move these elements between the containers',
      'assignee' => 'Bob',
      'tags' => [
        'Feature',
        '',
      ],
    ],
  ];

  $code_review = [
    [
      'title' => 'Code Review',
      'description' => 'CODE_REVIEW',
      'assignee' => 'Tim',
      'tags' => [
        'Backlog',
        'Bug',
      ],
    ],
  ];

  $completed = [
    [
      'title' => 'Completed',
      'description' => 'COMPLETED',
      'assignee' => 'jeffrey',
      'tags' => [
        'Backend',
        'Frontend',
      ],
    ],
  ];

  $data = [
    // manager?
    // leader
    'todo' => $todo,
    'in_progress' => $in_progress,
    'code_review' => $code_review,
    'completed' => $completed,
  ];

  // assoc array to obj (recursively): https://stackoverflow.com/a/1869147
  return json_decode(json_encode($data), false);
}
