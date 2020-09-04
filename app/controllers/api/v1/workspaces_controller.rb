module Api
  module V1
    class WorkspacesController < ApplicationController
      protect_from_forgery with: :null_session

      def index
        workspaces = Workspace.all
        render json: WorkspaceSerializer.new(workspaces).serialized_json
      end

      def show
        workspace = Workspace.find(params[:id])
        render json: WorkspaceSerializer.new(workspace,options).serialized_json
      end

      def update
        workspace = Workspace.find(params[:id])
        if workspace.update(workspace_params)
          render json: WorkspaceSerializer.new(workspace).serialized_json
        else
          render json: {error: workspace.errors.messages}, status: 422
        end
      end
      private
      def workspace_params
        params.require(:workspace).permit(:title)
      end

      def options
        @options ||= { include: %i[roadmap]}
      end
    end
  end
end
