import AboutImage from "../assets/images/about.svg";

const AboutPage = () => {
    return (
        <div className="homepage">
            <div className="container mx-auto px-4">

                {/* About Section */}
                <div className="about grid md:grid-cols-2 grid-cols-1 items-center md:pt-20 pt-32 gap-20">
                    <div className="box md:order-1 order-2">
                        <img
                            src={AboutImage}
                            alt="About Image"
                            className="lg:w-[500px] w-[400px] mx-auto"
                        />
                    </div>
                    <div className="box md:order-2 order-1">
                        <h1 className="lg:text-5xl/tight text-3xl font-medium mb-7">
                            Lorem ipsum dolor{" "}
                            <span className="font-bold text-sky-400 underline">sit amet.</span>
                        </h1>
                        <p className="text-base/loose">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
                            expedita eius architecto odio quae similique quibusdam quaerat itaque
                            iusto fugiat?
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutPage