# @Author: KaileDing
# @Date:   2017-06-16 00:37:40
# @Last Modified by:   kaileding
# @Last Modified time: 2017-06-16 01:53:38

# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

configure_aws_cli(){
	aws --version
	aws configure set default.region us-west-2
	aws configure set default.output json
}

make_task_def(){
	task_template='[
		{
			"name": "rattit-content-service-dev",
			"image": "%s.dkr.ecr.us-west-2.amazonaws.com/rattit_content_service:%s",
			"essential": true,
			"memory": 300,
			"cpu": 10,
			"portMappings": [
				{
					"containerPort": 3500,
					"hostPort": 80
				}
			],
			"environment": [
				{
					"name": "NODE_ENV",
					"value": "%s"
				},
				{
					"name": "GOOGLE_API_KEY",
					"value": "%s"
				},
				{
					"name": "DB_MAX_CONNECTIONS",
					"value": %s
				},
				{
					"name": "DB_NAME",
					"value": "%s"
				},
				{
					"name": "DB_HOST",
					"value": "%s"
				},
				{
					"name": "DB_USER",
					"value": "%s"
				},
				{
					"name": "DB_PSWD",
					"value": "%s"
				}
			]
		}
	]'
	
	task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $CIRCLE_SHA1 $NODE_ENV $GOOGLE_API_KEY $DB_MAX_CONNECTIONS $AWS_DB_NAME $AWS_DB_HOST $AWS_DB_USER $AWS_DB_PSWD)

	# echo "$task_def"
}

register_definition() {
    family="rattit_content_service_dev_taskfamily"

    if revision=$(aws ecs register-task-definition --container-definitions "$task_def" --family $family | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

deploy_cluster() {

    make_task_def
    register_definition
    if [[ $(aws ecs update-service --cluster rattit-content-service-dev --service rattit_content_service_dev --task-definition $revision | \
                   $JQ '.service.taskDefinition') != $revision ]]; then
        echo "Error updating service."
        return 1
    fi

    # wait for older revisions to disappear
    # not really necessary, but nice for demos
    for attempt in {1..30}; do
        if stale=$(aws ecs describe-services --cluster rattit-content-service-dev --services rattit_content_service_dev | \
                       $JQ ".services[0].deployments | .[] | select(.taskDefinition != \"$revision\") | .taskDefinition"); then
            echo "Waiting for stale deployments:"
            echo "$stale"
            sleep 5
        else
            echo "Deployed!"
            return 0
        fi
    done
    echo "Service update took too long."
    return 1
}


push_ecr_image(){
	eval $(aws ecr get-login --region us-west-2)
	docker push $AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/rattit_content_service:$CIRCLE_SHA1
}


configure_aws_cli
push_ecr_image
deploy_cluster