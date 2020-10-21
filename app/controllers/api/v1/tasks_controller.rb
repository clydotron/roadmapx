module Api
  module V1
    class TasksController < ApplicationController
      protect_from_forgery with: :null_session
      
      def index
        tasks = Task.all

        render json: TaskSerializer.new(tasks).serialized_json
      end

      def show
        task = Task.find(params[:id])
        render json: TaskSerializer.new(task).serialized_json
      end

      def create
        task = row.tasks.new(task_params)

        if task.save
          render json: TaskSerializer.new(task).serialized_json
        else
          render json: {error: task.errors.messages}, status: 422
        end
      end

      def update
        task = Task.find(params[:id])
        if task.update(airline_params)
          render json: TaskSerializer.new(task).serialized_json
        else
          render json: {error: task.errors.messages}, status: 422
        end
      end

      def destroy
        task = Task.find(params[:id])

        if task.destroy
          head :no_content
        else
          render json: {error: task.errors.messages}, status: 422
        end
      end

      private
      def row
        @row = Row.find(params[:row_id])
      end
      def task_params
        params.require(:task).permit( :name, :color, :row_id )
      end

    end
  end
end