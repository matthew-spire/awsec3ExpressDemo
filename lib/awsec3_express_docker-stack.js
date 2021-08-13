"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
class Awsec3ExpressDockerStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, "helloVpc", { maxAzs: 2 });
        // Create an ECS cluster
        var cluster = new ecs.Cluster(this, "Cluster", { vpc });
        cluster.addCapacity("DefaultAutoScalingGroup", {
            instanceType: new ec2.InstanceType("t2.micro"),
            maxCapacity: 3,
        });
        // hello service
        const helloTaskDefinition = new ecs.Ec2TaskDefinition(this, "hello-task-definition", {});
        const helloContainer = helloTaskDefinition.addContainer("hello", {
            image: ecs.ContainerImage.fromRegistry("jrwtango/c2express002"),
            memoryLimitMiB: 128,
        });
        helloContainer.addPortMappings({
            containerPort: 3000,
        });
        const helloService = new ecs.Ec2Service(this, "hello-service", {
            cluster: cluster,
            desiredCount: 3,
            taskDefinition: helloTaskDefinition,
        });
        // Internet facing load balancer for the frontend services
        const externalLB = new elbv2.ApplicationLoadBalancer(this, "external", {
            vpc: vpc,
            internetFacing: true,
        });
        const externalListener = externalLB.addListener("PublicListener", {
            port: 80,
            open: true,
        });
        externalListener.addTargets("greeter", {
            port: 80,
            targets: [helloService],
        });
        new cdk.CfnOutput(this, "ExternalDNS", {
            value: externalLB.loadBalancerDnsName,
        });
    }
}
exports.Awsec3ExpressDockerStack = Awsec3ExpressDockerStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNDO0FBQ3RDLHdDQUF5QztBQUN6Qyx3Q0FBeUM7QUFDekMsNkRBQThEO0FBRTlELE1BQWEsd0JBQXlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFekQsd0JBQXdCO1FBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO1lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQzlDLFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCO1FBQ2hCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQ25ELElBQUksRUFDSix1QkFBdUIsRUFDdkIsRUFBRSxDQUNILENBQUM7UUFFRixNQUFNLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQy9ELEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQztZQUMvRCxjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsZUFBZSxDQUFDO1lBQzdCLGFBQWEsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzdELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFlBQVksRUFBRSxDQUFDO1lBQ2YsY0FBYyxFQUFFLG1CQUFtQjtTQUNwQyxDQUFDLENBQUM7UUFDSCwwREFBMEQ7UUFFMUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNyRSxHQUFHLEVBQUUsR0FBRztZQUNSLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRSxJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtZQUNyQyxJQUFJLEVBQUUsRUFBRTtZQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2REQsNERBdURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xyXG5pbXBvcnQgZWMyID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1lYzJcIik7XHJcbmltcG9ydCBlY3MgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWVjc1wiKTtcclxuaW1wb3J0IGVsYnYyID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyXCIpO1xyXG5cclxuZXhwb3J0IGNsYXNzIEF3c2VjM0V4cHJlc3NEb2NrZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIFwiaGVsbG9WcGNcIiwgeyBtYXhBenM6IDIgfSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGFuIEVDUyBjbHVzdGVyXHJcbiAgICB2YXIgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCBcIkNsdXN0ZXJcIiwgeyB2cGMgfSk7XHJcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KFwiRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBcIiwge1xyXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKFwidDIubWljcm9cIiksXHJcbiAgICAgIG1heENhcGFjaXR5OiAzLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gaGVsbG8gc2VydmljZVxyXG4gICAgY29uc3QgaGVsbG9UYXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIFwiaGVsbG8tdGFzay1kZWZpbml0aW9uXCIsXHJcbiAgICAgIHt9XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGhlbGxvQ29udGFpbmVyID0gaGVsbG9UYXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJoZWxsb1wiLCB7XHJcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KFwianJ3dGFuZ28vYzJleHByZXNzMDAyXCIpLFxyXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxyXG4gICAgfSk7XHJcblxyXG4gICAgaGVsbG9Db250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcclxuICAgICAgY29udGFpbmVyUG9ydDogMzAwMCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGhlbGxvU2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZSh0aGlzLCBcImhlbGxvLXNlcnZpY2VcIiwge1xyXG4gICAgICBjbHVzdGVyOiBjbHVzdGVyLFxyXG4gICAgICBkZXNpcmVkQ291bnQ6IDMsXHJcbiAgICAgIHRhc2tEZWZpbml0aW9uOiBoZWxsb1Rhc2tEZWZpbml0aW9uLFxyXG4gICAgfSk7XHJcbiAgICAvLyBJbnRlcm5ldCBmYWNpbmcgbG9hZCBiYWxhbmNlciBmb3IgdGhlIGZyb250ZW5kIHNlcnZpY2VzXHJcblxyXG4gICAgY29uc3QgZXh0ZXJuYWxMQiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcih0aGlzLCBcImV4dGVybmFsXCIsIHtcclxuICAgICAgdnBjOiB2cGMsXHJcbiAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZXh0ZXJuYWxMaXN0ZW5lciA9IGV4dGVybmFsTEIuYWRkTGlzdGVuZXIoXCJQdWJsaWNMaXN0ZW5lclwiLCB7XHJcbiAgICAgIHBvcnQ6IDgwLFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgZXh0ZXJuYWxMaXN0ZW5lci5hZGRUYXJnZXRzKFwiZ3JlZXRlclwiLCB7XHJcbiAgICAgIHBvcnQ6IDgwLFxyXG4gICAgICB0YXJnZXRzOiBbaGVsbG9TZXJ2aWNlXSxcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiRXh0ZXJuYWxETlNcIiwge1xyXG4gICAgICB2YWx1ZTogZXh0ZXJuYWxMQi5sb2FkQmFsYW5jZXJEbnNOYW1lLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==