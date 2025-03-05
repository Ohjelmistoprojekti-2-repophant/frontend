*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Add New Project
    Open Browser    http://localhost:5173    Chrome
    Input Text    name=name    Test Name
    Input Text    name=description    Test Description
    Input Text    name=repositoryLink    https://github.com/your-repository
    Input Text    name=language    Ruby
    Click Element    name=createButton
    Page Should Contain     Projects
    Page Should Contain     Test Name

Add New Project By Link
    Input Text    id=:rb:    https://github.com/Ohjelmistoprojekti-2-repophant/backend
    Click Element    name=fetchButton
    Sleep               1s
    Click Element    xpath=//button[normalize-space(text())='Create']