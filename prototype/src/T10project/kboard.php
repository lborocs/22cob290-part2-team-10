<!DOCTYPE HTML>

<html>

	<head>
		<!-- bootstrap cdn -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
		<!-- JQuery CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
		
		<link rel="stylesheet" href="kboardcss.css">
		<script src="kboardscript.js"></script>
		
	</head>

	<body>	
		<div class="container">
			<h1 class="h3"> PAGE TITLE </h1>
			
			<div id="to_do_modal" class="modal" tabindex="-1" role="dialog"> 
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Add task</h5>
							<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" id="close_to_do_modal2">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<!-- Form goes here-->
							<form role="form" method="POST" action="">
								<div class="form-group">
									<label class="control-label">Title</label>
									<div>
										<input type="text" class="form-control input-lg" name="title" placeholder="Title">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label">Description</label>
									<div>
										<textarea class="form-control" id="to_do_textarea" rows="3" placeholder="Task description"></textarea>
									</div>
								</div>	
								<div class="form-group">
									<label class="control-label">Tags</label>
									<div>
										<textarea class="form-control" id="to_do_textarea" rows="2" placeholder="Enter tags, separated by commas, e.g. Backend,Frontend,Troubleshooting"></textarea>
									</div>
								</div>	
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal" id="close_to_do_modal">Close</button>
							<button type="button" class="btn btn-primary" id="add_task_to_do">Add task</button>
						</div>
					</div>
				</div>
			</div>
			
			<div id="in_progress_modal" class="modal"> 
				<div class="modal-dialog" role="document">
					<div class="modal-content">
					  <div class="modal-header">
						<h5 class="modal-title">Add task</h5>
						<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div class="modal-body">
						<p>Modal body text goes here.</p>
					  </div>
					  <div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary">Add task</button>
					  </div>
					</div>
				</div>
			</div>
			
			<div id="code_review_modal" class="modal"> 
				<div class="modal-header">
					<span class="close">&times;</span>
					<h4>Add task</h4>
				</div>
				<div class="modal-content">
				</div>
			</div>

			<div id="completed_modal" class="modal"> 
				<div class="modal-header">
					<span class="close">&times;</span>
					<h4>Add task</h4>
				</div>
				<div class="modal-content">
				</div>
			</div>				
			
			<div class="row">
				<div class="col-12 col-lg-3">	
					<div class = "card mb-3">
						<div class="card-header">
							<h5 class="card-title">To Do</h5>
						</div>
						<div class="class-body m-2">
							<!-- List of tasks will be stored inside this card div 
							ondragover event specifies where the dragged data can be dropped-->
							<div class="tasks" id="to_do" ondrop="drop(event)" ondragover="allowDrop(event)">					
								<!-- REPRESENTS AN INDIVIDUAL TASK-->
								<div class="card mb-3 drag_item" id="item1" draggable="true" ondragstart="drag(event)" >
								  <div class="card-body">
									<span class="badge bg-primary text-white mb-2">Tag1</span>
									<p style="font-weight: bold">Title</p>
									<p class="mb-0">You can move these elements between the containers</p>
								  </div>
								</div>	
								<!-- End of task-->
							</div>
							<div class="btn btn-primary btn-block" id="to_do_button">Add task</div>
						</div>
					</div>
					
				</div>
				
				<div class="col-12 col-lg-3">	
					
					<!-- List of tasks will be stored inside this card div -->
					<div class = "card mb-3">
						<div class="card-header">
							<h5 class="card-title">In Progress</h5>
						</div>
						<div class="class-body m-2">
							<div class="tasks" id="in_progress" ondrop="drop(event)" ondragover="allowDrop(event)">
													

							</div>
							<div class="btn btn-primary btn-block" id="in_progress_button">Add task</div>

						</div>
					</div>
					
				</div>			
				
				<div class="col-12 col-lg-3">	
					
					<!-- List of tasks will be stored inside this card div -->
					<div class = "card mb-3">
						<div class="card-header">
							<h5 class="card-title">Code Review</h5>
						</div>
						<div class="class-body  m-2">
							<div class="tasks" id="code_review" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
							<div class="btn btn-primary btn-block" id="code_review_button">Add task</div>
						</div>
					</div>
					
				</div>			
				
				<div class="col-12 col-lg-3">	
					
					<!-- List of tasks will be stored inside this card div -->
					<div class = "card mb-3">
						<div class="card-header">
							<h5 class="card-title">Completed</h5>
						</div>
						<div class="class-body m-2">
							<div class="tasks" id="completed" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
							<div class="btn btn-primary btn-block" id="completed_button">Add task</div>
						</div>
					</div>
					
				</div>			
				


			
			</div>
		</div>
	</body>
</html>