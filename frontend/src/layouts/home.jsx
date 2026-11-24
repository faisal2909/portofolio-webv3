import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ProjectList from "@/components/projectList"
import TechStack from "@/components/techStack"

export default function home() {
    return (
        <>
            <Navbar />
            <Hero />
            <ProjectList />
            <TechStack />
        </>
    )
}