import { Link } from '@inertiajs/react';

export default function Blog({ className = 'right', title, subtitle, description, img, btn, link }) {

    return (
        <>
            <section id='blog' className='my-5 md:my-[5rem]'>
                <div className='container'>
                    <div className={`${className} l-blog shadow-md rounded-2xl`}>
                        <div className='l-text'>
                            <h2>
                                {title}
                            </h2>
                            <h3>
                                {subtitle}
                            </h3>
                            <p>
                                {description}
                            </p>
                            {link &&
                                <div className='mt-5'>
                                    <Link href={link} className='btn-primary btn-blog'>
                                        {btn}
                                    </Link>
                                </div>

                            }
                        </div>
                        <div className='l-img'>
                            <img src={img} alt={img} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}