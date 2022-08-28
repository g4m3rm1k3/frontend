import React, { Component } from "react";
import axios from "axios";
import CustomModal from "./components/Modal";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			viewCompleted: false,
			activeItem: {
				title: "",
				description: "",
				completed: false,
			},
			todoList: [],
		};
	}

	componentDidMount() {
		this.refreshList();
	}
	refreshList = () => {
		axios
			.get("http://localhost:8000/api/tasks/")
			.then((res) => this.setState({ todoList: res.data }))
			.catch((err) => console.log(err));
	};

	displayCompleted = (status) => {
		if (status) {
			return this.setState({ viewCompleted: true });
		}
		return this.setState({ viewCompleted: false });
	};

	renderTabList = () => {
		return (
			<div className="my-5 tab-list">
				<span
					onClick={() => this.displayCompleted(true)}
					className={`btn border-dark text-light${
						this.state.viewCompleted ? " bg-info text-dark" : ""
					}`}
				>
					Completed
				</span>
				<span
					onClick={() => this.displayCompleted(false)}
					className={`btn border-dark text-light${
						this.state.viewCompleted ? "" : " bg-info text-dark"
					}`}
				>
					Incompleted
				</span>
			</div>
		);
	};

	// Rendering items in teh list (completed or incompleted)
	renderItems = () => {
		const { viewCompleted } = this.state;
		const newItems = this.state.todoList.filter(
			(item) => item.completed === viewCompleted
		);
		return newItems.map((item) => (
			<li
				key={item.id}
				className="list-group-item d-flex bg-dark text-light justify-content-between align-items-center"
			>
				<span
					className={`todo-title me-2 ${
						this.state.viewCompleted ? "completed-todo" : ""
					}`}
					title={item.description}
				>
					{item.title}
				</span>
				<span>
					<button
						onClick={() => this.editItem(item)}
						className="btn btn-warning me-3 "
					>
						Edit
					</button>
					<button
						onClick={() => this.handleDelete(item)}
						className="btn btn-danger me-2 "
					>
						Delete
					</button>
				</span>
			</li>
		));
	};

	// Create toggle property
	toggle = () => {
		this.setState({ modal: !this.state.modal });
	};

	handleSubmit = (item) => {
		this.toggle();
		if (item.id) {
			axios
				.put(`http://localhost:8000/api/tasks/${item.id}/ `, item)
				.then((res) => this.refreshList());
		}
		axios
			.post("http://localhost:8000/api/tasks/", item)
			.then((res) => this.refreshList());
	};

	handleDelete = (item) => {
		axios
			.delete(`http://localhost:8000/api/tasks/${item.id}/ `)
			.then((res) => this.refreshList());
	};

	createItem = () => {
		const item = { title: "", description: "", completed: false };
		this.setState({ activeItem: item, modal: !this.state.modal });
	};

	editItem = (item) => {
		this.setState({ activeItem: item, modal: !this.state.modal });
	};

	render() {
		return (
			<main className="content p-3 mb-2 bg-dark text-warning">
				<h1 className="text-light text-uppercase text-center my-4">
					Task Manager
				</h1>
				<div className="row ">
					<div className="md-6 sm-10 max-auto p-0 ">
						<div className="card p-3 bg-secondary text-light">
							<div>
								<button
									onClick={this.createItem}
									className="btn btn-success border-dark"
								>
									Add task
								</button>
							</div>
							{this.renderTabList()}
							<ul className="list-group list-group-flush">
								{this.renderItems()}
							</ul>
						</div>
					</div>
				</div>
				<footer className="my-3 mb-5 bg-dark text-light text-center">
					Copyright 2022 &copy; All rights reserved
				</footer>
				{this.state.modal && (
					<CustomModal
						activeItem={this.state.activeItem}
						toggle={this.toggle}
						onSave={this.handleSubmit}
					/>
				)}
			</main>
		);
	}
}

export default App;
