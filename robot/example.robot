*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Add New Project
    Open Browser    http://localhost:5173    Chrome
    Page Should Contain     Projects
    Input Text    name=name    Test Name
    Input Text    name=description    Test Description
    Input Text    name=repositoryLink    https://github.com/your-repository
    Input Text    name=language    Ruby
    Click Element    name=createButton
    Sleep               1s
    Element Should Contain    id=project-box    Project List
    Element Should Contain    id=project-box    Test Name

Add New Project By Link
    Input Text    repositoryFetchInput    https://github.com/Ohjelmistoprojekti-2-repophant/backend
    Click Element    name=fetchButton
    Sleep               1s
    Click Element    name=createButton
    Sleep               1s
    Element Should Contain    id=project-box    Ohjelmistoprojekti-2-repophant/backend

Test Search Bar
    Input Text    repositorySearchBar    Test Name
    Sleep               1s
    Element Should Contain    id=project-box    Test Name
    Element Should Not Contain    id=project-box    Ohjelmistoprojekti-2-repophant/backend
