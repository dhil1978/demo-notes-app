import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/StorageStack.js
import { Bucket, Table } from "sst/constructs";
function StorageStack({ stack, app }) {
  const bucket = new Bucket(stack, "Uploads");
  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string"
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" }
  });
  return {
    table,
    bucket
  };
}
__name(StorageStack, "StorageStack");

// stacks/ApiStack.js
import { Api, use } from "sst/constructs";
function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table],
        environment: {
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
        }
      }
    },
    routes: {
      "POST /notes": "packages/functions/src/create.main",
      "GET /notes/{id}": "packages/functions/src/get.main",
      "GET /notes": "packages/functions/src/list.main",
      "PUT /notes/{id}": "packages/functions/src/update.main",
      "DELETE /notes/{id}": "packages/functions/src/delete.main"
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(ApiStack, "ApiStack");

// stacks/AuthStack.js
import * as iam from "aws-cdk-lib/aws-iam";
import { Cognito, use as use2 } from "sst/constructs";
function AuthStack({ stack, app }) {
  const { bucket } = use2(StorageStack);
  const { api } = use2(ApiStack);
  const auth = new Cognito(stack, "Auth", {
    login: ["email"]
  });
  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    })
  ]);
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId
  });
  return {
    auth
  };
}
__name(AuthStack, "AuthStack");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "notes",
      region: "us-east-1"
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ApiStack).stack(AuthStack);
  }
};
export {
  sst_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RhY2tzL1N0b3JhZ2VTdGFjay5qcyIsICJzdGFja3MvQXBpU3RhY2suanMiLCAic3RhY2tzL0F1dGhTdGFjay5qcyIsICJzc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBCdWNrZXQsIFRhYmxlIH0gZnJvbSBcInNzdC9jb25zdHJ1Y3RzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBTdG9yYWdlU3RhY2soeyBzdGFjaywgYXBwIH0pIHtcblxuLy8gQ3JlYXRlIGFuIFMzIGJ1Y2tldFxuXHRjb25zdCBidWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrLCBcIlVwbG9hZHNcIik7XG5cbi8vIENyZWF0ZSB0aGUgRHluYW1vREIgdGFibGVcblx0Y29uc3QgdGFibGUgPSBuZXcgVGFibGUoc3RhY2ssIFwiTm90ZXNcIiwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0dXNlcklkOiBcInN0cmluZ1wiLFxuXHRcdFx0bm90ZUlkOiBcInN0cmluZ1wiLFxuXHRcdH0sXG5cdFx0cHJpbWFyeUluZGV4OiB7IHBhcnRpdGlvbktleTogXCJ1c2VySWRcIiwgc29ydEtleTogXCJub3RlSWRcIiB9LFxuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdHRhYmxlLFxuXHRcdGJ1Y2tldCxcblx0fTtcbn1cbiIsICJpbXBvcnQgeyBBcGksIHVzZSB9IGZyb20gXCJzc3QvY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgU3RvcmFnZVN0YWNrIH0gZnJvbSBcIi4vU3RvcmFnZVN0YWNrXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcGlTdGFjayh7IHN0YWNrLCBhcHAgfSkge1xuXHRjb25zdCB7IHRhYmxlIH0gPSB1c2UoU3RvcmFnZVN0YWNrKTtcbi8vIENyZWF0ZSB0aGUgQVBJXG5cdGNvbnN0IGFwaSA9IG5ldyBBcGkoc3RhY2ssIFwiQXBpXCIsIHtcblx0XHRkZWZhdWx0czoge1xuXHRcdFx0YXV0aG9yaXplcjogXCJpYW1cIixcblx0XHRcdGZ1bmN0aW9uOiB7XG5cdFx0XHRcdGJpbmQ6IFt0YWJsZV0sXG5cdFx0XHRcdGVudmlyb25tZW50OiB7XG5cdFx0XHRcdFx0U1RSSVBFX1NFQ1JFVF9LRVk6IHByb2Nlc3MuZW52LlNUUklQRV9TRUNSRVRfS0VZLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdHJvdXRlczoge1xuXHRcdFx0XCJQT1NUIC9ub3Rlc1wiOiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvY3JlYXRlLm1haW5cIixcblx0XHRcdFwiR0VUIC9ub3Rlcy97aWR9XCI6IFwicGFja2FnZXMvZnVuY3Rpb25zL3NyYy9nZXQubWFpblwiLFxuXHRcdFx0XCJHRVQgL25vdGVzXCI6IFwicGFja2FnZXMvZnVuY3Rpb25zL3NyYy9saXN0Lm1haW5cIixcblx0XHRcdFwiUFVUIC9ub3Rlcy97aWR9XCI6IFwicGFja2FnZXMvZnVuY3Rpb25zL3NyYy91cGRhdGUubWFpblwiLFxuXHRcdFx0XCJERUxFVEUgL25vdGVzL3tpZH1cIjogXCJwYWNrYWdlcy9mdW5jdGlvbnMvc3JjL2RlbGV0ZS5tYWluXCIsXG5cdFx0fSxcblx0fSk7XG5cbi8vIFNob3cgdGhlIEFQSSBlbmRwb2ludCBpbiB0aGUgb3V0cHV0XG5cdHN0YWNrLmFkZE91dHB1dHMoe1xuXHRcdEFwaUVuZHBvaW50OiBhcGkudXJsLFxuXHR9KTtcblxuLy8gUmV0dXJuIHRoZSBBUEkgcmVzb3VyY2Vcblx0cmV0dXJuIHtcblx0XHRhcGksXG5cdH07XG59XG4iLCAiaW1wb3J0ICogYXMgaWFtIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb2duaXRvLCB1c2UgfSBmcm9tIFwic3N0L2NvbnN0cnVjdHNcIjtcbmltcG9ydCB7IFN0b3JhZ2VTdGFjayB9IGZyb20gXCIuL1N0b3JhZ2VTdGFja1wiO1xuaW1wb3J0IHsgQXBpU3RhY2sgfSBmcm9tIFwiLi9BcGlTdGFja1wiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBBdXRoU3RhY2soeyBzdGFjaywgYXBwIH0pIHtcblxuXHRjb25zdCB7IGJ1Y2tldCB9ID0gdXNlKFN0b3JhZ2VTdGFjayk7XG5cdGNvbnN0IHsgYXBpIH0gPSB1c2UoQXBpU3RhY2spO1xuXHQvLyBDcmVhdGUgYSBDb2duaXRvIFVzZXIgUG9vbCBhbmQgSWRlbnRpdHkgUG9vbFxuXG5cdGNvbnN0IGF1dGggPSBuZXcgQ29nbml0byhzdGFjaywgXCJBdXRoXCIsIHtcblx0XHRsb2dpbjogW1wiZW1haWxcIl0sXG5cdH0pO1xuXG5cdGF1dGguYXR0YWNoUGVybWlzc2lvbnNGb3JBdXRoVXNlcnMoc3RhY2ssIFtcblx0XHQvLyBBbGxvdyBhY2Nlc3MgdG8gdGhlIEFQSVxuXHRcdGFwaSxcblx0XHQvLyBQb2xpY3kgZ3JhbnRpbmcgYWNjZXNzIHRvIGEgc3BlY2lmaWMgZm9sZGVyIGluIHRoZSBidWNrZVxuXHRcdG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcblx0XHRcdGFjdGlvbnM6IFtcInMzOipcIl0sXG5cdFx0XHRlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG5cdFx0XHRyZXNvdXJjZXM6IFtcblx0XHRcdFx0YnVja2V0LmJ1Y2tldEFybiArIFwiL3ByaXZhdGUvJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8qXCIsXG5cdFx0XHRdLFxuXHRcdH0pLFxuXHRdKTtcblxuXHQvLyBTaG93IHRoZSBhdXRoIHJlc291cmNlcyBpbiB0aGUgb3V0cHV0XG5cdHN0YWNrLmFkZE91dHB1dHMoe1xuXHRcdFJlZ2lvbjogYXBwLnJlZ2lvbixcblx0XHRVc2VyUG9vbElkOiBhdXRoLnVzZXJQb29sSWQsXG5cdFx0SWRlbnRpdHlQb29sSWQ6IGF1dGguY29nbml0b0lkZW50aXR5UG9vbElkLFxuXHRcdFVzZXJQb29sQ2xpZW50SWQ6IGF1dGgudXNlclBvb2xDbGllbnRJZCxcblx0fSk7XG5cblx0Ly8gUmV0dXJuIHRoZSBhdXRoIHJlc291cmNlXG5cdHJldHVybiB7XG5cdFx0YXV0aCxcblx0fTtcbn1cbiIsICJpbXBvcnQgeyBTU1RDb25maWcgfSBmcm9tIFwic3N0XCI7XG5pbXBvcnQgeyBTdG9yYWdlU3RhY2sgfSBmcm9tIFwiLi9zdGFja3MvU3RvcmFnZVN0YWNrXCI7XG5pbXBvcnQgeyBBcGlTdGFjayB9IGZyb20gXCIuL3N0YWNrcy9BcGlTdGFja1wiO1xuaW1wb3J0IHsgQXV0aFN0YWNrIH0gZnJvbSBcIi4vc3RhY2tzL0F1dGhTdGFja1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZyhfaW5wdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJub3Rlc1wiLFxuICAgICAgcmVnaW9uOiBcInVzLWVhc3QtMVwiLFxuICAgIH07XG4gIH0sXG4gIHN0YWNrcyhhcHApIHtcbiAgICBhcHAuc3RhY2soU3RvcmFnZVN0YWNrKS5zdGFjayhBcGlTdGFjaykuc3RhY2soQXV0aFN0YWNrKTtcbiAgfVxufSBzYXRpc2ZpZXMgU1NUQ29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7QUFBQSxTQUFTLFFBQVEsYUFBYTtBQUV2QixTQUFTLGFBQWEsRUFBRSxPQUFPLElBQUksR0FBRztBQUc1QyxRQUFNLFNBQVMsSUFBSSxPQUFPLE9BQU8sU0FBUztBQUcxQyxRQUFNLFFBQVEsSUFBSSxNQUFNLE9BQU8sU0FBUztBQUFBLElBQ3ZDLFFBQVE7QUFBQSxNQUNQLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxJQUNUO0FBQUEsSUFDQSxjQUFjLEVBQUUsY0FBYyxVQUFVLFNBQVMsU0FBUztBQUFBLEVBQzNELENBQUM7QUFFRCxTQUFPO0FBQUEsSUFDTjtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQ0Q7QUFsQmdCOzs7QUNGaEIsU0FBUyxLQUFLLFdBQVc7QUFHbEIsU0FBUyxTQUFTLEVBQUUsT0FBTyxJQUFJLEdBQUc7QUFDeEMsUUFBTSxFQUFFLE1BQU0sSUFBSSxJQUFJLFlBQVk7QUFFbEMsUUFBTSxNQUFNLElBQUksSUFBSSxPQUFPLE9BQU87QUFBQSxJQUNqQyxVQUFVO0FBQUEsTUFDVCxZQUFZO0FBQUEsTUFDWixVQUFVO0FBQUEsUUFDVCxNQUFNLENBQUMsS0FBSztBQUFBLFFBQ1osYUFBYTtBQUFBLFVBQ1osbUJBQW1CLFFBQVEsSUFBSTtBQUFBLFFBQ2hDO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLGVBQWU7QUFBQSxNQUNmLG1CQUFtQjtBQUFBLE1BQ25CLGNBQWM7QUFBQSxNQUNkLG1CQUFtQjtBQUFBLE1BQ25CLHNCQUFzQjtBQUFBLElBQ3ZCO0FBQUEsRUFDRCxDQUFDO0FBR0QsUUFBTSxXQUFXO0FBQUEsSUFDaEIsYUFBYSxJQUFJO0FBQUEsRUFDbEIsQ0FBQztBQUdELFNBQU87QUFBQSxJQUNOO0FBQUEsRUFDRDtBQUNEO0FBL0JnQjs7O0FDSGhCLFlBQVksU0FBUztBQUNyQixTQUFTLFNBQVMsT0FBQUEsWUFBVztBQUt0QixTQUFTLFVBQVUsRUFBRSxPQUFPLElBQUksR0FBRztBQUV6QyxRQUFNLEVBQUUsT0FBTyxJQUFJQyxLQUFJLFlBQVk7QUFDbkMsUUFBTSxFQUFFLElBQUksSUFBSUEsS0FBSSxRQUFRO0FBRzVCLFFBQU0sT0FBTyxJQUFJLFFBQVEsT0FBTyxRQUFRO0FBQUEsSUFDdkMsT0FBTyxDQUFDLE9BQU87QUFBQSxFQUNoQixDQUFDO0FBRUQsT0FBSyw4QkFBOEIsT0FBTztBQUFBLElBRXpDO0FBQUEsSUFFQSxJQUFRLG9CQUFnQjtBQUFBLE1BQ3ZCLFNBQVMsQ0FBQyxNQUFNO0FBQUEsTUFDaEIsUUFBWSxXQUFPO0FBQUEsTUFDbkIsV0FBVztBQUFBLFFBQ1YsT0FBTyxZQUFZO0FBQUEsTUFDcEI7QUFBQSxJQUNELENBQUM7QUFBQSxFQUNGLENBQUM7QUFHRCxRQUFNLFdBQVc7QUFBQSxJQUNoQixRQUFRLElBQUk7QUFBQSxJQUNaLFlBQVksS0FBSztBQUFBLElBQ2pCLGdCQUFnQixLQUFLO0FBQUEsSUFDckIsa0JBQWtCLEtBQUs7QUFBQSxFQUN4QixDQUFDO0FBR0QsU0FBTztBQUFBLElBQ047QUFBQSxFQUNEO0FBQ0Q7QUFuQ2dCOzs7QUNEaEIsSUFBTyxxQkFBUTtBQUFBLEVBQ2IsT0FBTyxRQUFRO0FBQ2IsV0FBTztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPLEtBQUs7QUFDVixRQUFJLE1BQU0sWUFBWSxFQUFFLE1BQU0sUUFBUSxFQUFFLE1BQU0sU0FBUztBQUFBLEVBQ3pEO0FBQ0Y7IiwKICAibmFtZXMiOiBbInVzZSIsICJ1c2UiXQp9Cg==
