# heydu-vitals

It has utility methods, schemas, templates and images which we can use for other heydu repositories

## How to publish to Code Artifacts

- Navigate to [https://ap-south-1.console.aws.amazon.com/codesuite/codeartifact/d/975050238836/heydu/r/heydu-vitals?region=ap-south-1&packages-meta=eyJmIjp7fSwicyI6e30sIm4iOjIwLCJpIjowfQ](https://ap-south-1.console.aws.amazon.com/codesuite/codeartifact/d/975050238836/heydu/r/heydu-vitals?region=ap-south-1&packages-meta=eyJmIjp7fSwicyI6e30sIm4iOjIwLCJpIjowfQ)
- Click on View Connection Instructions and get the AWS CLI command after selecting npm from package manager client
- After successfully login, it will create credentials inside (`~/.npmrc`) file ( In case you have old credentials please do save it)
- Deploy the package with below command `npm publish`
